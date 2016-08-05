require 'test_helper'

class StoryTest < ActiveSupport::TestCase
  
  def setup
    @story = stories(:one)
  end

  test 'should be valid' do
    assert @story.valid?
  end

  test 'should not be valid' do
    @story.author = ''
    assert_not @story.valid?
  end

end
